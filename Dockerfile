# Use nginx image
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy your index.html to nginx folder
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY img /usr/share/nginx/html/img/

COPY package.json /usr/share/nginx/html/packages



# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]