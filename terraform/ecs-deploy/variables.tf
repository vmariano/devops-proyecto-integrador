variable "region" {
  default     = "sa-east-1"
  description = "Región AWS"
}

# variable "container_image" {
#   description = "URL de la imagen del contenedor (GitHub o Docker Hub)"
#   type        = string
# }

variable "project_name" {
  description = "Nombre base del proyecto"
  default     = "trabajo-final-mundose"
}

## Variables para imágenes específicas de servicios ecommerce-app, grafan y prometheus
variable "frontend_image" {
  description = "Imagen del frontend (Next.js)"
  type        = string
}

variable "prometheus_image" {
  description = "Imagen personalizada de Prometheus"
  type        = string
}

variable "grafana_image" {
  description = "Imagen personalizada de Grafana"
  type        = string
}
