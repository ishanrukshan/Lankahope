FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create directory for uploads
RUN mkdir -p /app/uploads

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
