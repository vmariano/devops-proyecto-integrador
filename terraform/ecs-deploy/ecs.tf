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
      image     = var.frontend_image
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]
    },
    {
      name  = "prometheus"
      image = var.prometheus_image
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
      image = var.grafana_image
      essential = false
      portMappings = [
        {
          containerPort = 9500
          hostPort      = 9500
          protocol      = "tcp"
        }
      ]
      environment = [
        { name = "GF_SECURITY_ADMIN_USER", value = "admin" },
        { name = "GF_SECURITY_ADMIN_PASSWORD", value = "admin123" },
        { name = "GF_SERVER_HTTP_PORT", value = "9500" },
        { name = "GF_INSTALL_PLUGINS", value = "grafana-clock-panel,grafana-piechart-panel" }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/${var.project_name}"
          awslogs-region        = var.region
          awslogs-stream-prefix = "grafana"
        }
      }
    }
  ])

  volume {
    name = "prometheus-data" # Definición del volumen para Prometheus
  }

  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
}

resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${var.project_name}"
  retention_in_days = 7
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
