# Imagen base oficial de Prometheus
FROM prom/prometheus:v2.52.0

# Copia el archivo de configuración
COPY prometheus.yml /etc/prometheus/prometheus.yml

# Exponer puerto Prometheus
EXPOSE 9090

# Volumen para datos TSDB (persistencia opcional)
VOLUME ["/prometheus"]

# Comando de entrada (puede overridearse en ECS si quieres)
ENTRYPOINT [ "/bin/prometheus" ]
CMD [ "--config.file=/etc/prometheus/prometheus.yml", "--storage.tsdb.path=/prometheus" ]
