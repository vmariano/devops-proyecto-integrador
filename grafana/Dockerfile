FROM grafana/grafana:latest
COPY provisioning /etc/grafana/provisioning


# Asegurar permisos y path correcto
USER root
RUN chmod -R 755 /etc/grafana/provisioning