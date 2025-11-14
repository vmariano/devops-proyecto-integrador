output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "Nombre del servicio ECS"
  value       = aws_ecs_service.monitoring_service.name
}


output "security_group" {
  value = aws_security_group.ecs_sg.id
}

output "subnet_public" {
  value = aws_subnet.public.id
}