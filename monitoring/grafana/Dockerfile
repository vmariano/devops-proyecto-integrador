FROM grafana/grafana:12.2.1

WORKDIR /etc/grafana

# Copia provisioning
COPY provisioning /etc/grafana/provisioning

# Grafana usa UID 472, no “grafana”
USER root
RUN chown -R 472:0 /etc/grafana/provisioning

# Puerto configurado para ECS
ENV GF_SERVER_HTTP_PORT=9500

EXPOSE 9500

# Volver al usuario estándar (472)
USER 472

ENTRYPOINT ["/run.sh"]
