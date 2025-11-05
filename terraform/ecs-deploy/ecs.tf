##############################################
# ECS Cluster
##############################################

resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"
}

##############################################
# Task Definition con 3 contenedores
##############################################

resource "aws_ecs_task_definition" "monitoring" {
  family                   = "${var.project_name}-monitoring-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"
  memory                   = "2048"

  container_definitions = jsonencode([
    {
      name      = "ecommerce-app"
      image     = var.container_image
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        }
      ]
    },
    {
      name  = "prometheus"
      image = "prom/prometheus:latest"
      essential = false
      portMappings = [
        {
          containerPort = 9090
          hostPort      = 9090
          protocol      = "tcp"
        }
      ]
      command = [
        "--config.file=/etc/prometheus/prometheus.yml",
        "--storage.tsdb.path=/prometheus"
      ]
      mountPoints = [
        {
          sourceVolume  = "prometheus-data"
          containerPath = "/prometheus"
        }
      ]
    },
    {
      name  = "grafana"
      image = "grafana/grafana:latest"
      essential = false
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]
      environment = [
        { name = "GF_SECURITY_ADMIN_USER", value = "admin" },
        { name = "GF_SECURITY_ADMIN_PASSWORD", value = "admin123" },
        { name = "GF_SERVER_ROOT_URL", value = "http://localhost:3000" },
        { name = "GF_INSTALL_PLUGINS", value = "grafana-clock-panel,grafana-piechart-panel" }
      ]
    }
  ])

  volume {
    name = "prometheus-data"
  }

  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
}

##############################################
# ECS Service
##############################################

resource "aws_ecs_service" "monitoring_service" {
  name            = "${var.project_name}-monitoring-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.monitoring.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public.id]
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }

  depends_on = [
    aws_iam_role_policy_attachment.ecs_task_execution_role_policy
  ]
}
