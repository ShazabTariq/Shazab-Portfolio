# Use nginx image
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy your index.html to nginx folder
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY images /usr/share/nginx/html/images
COPY package.json /usr/share/nginx/html/packages
COPY 20240210_214816.jpg /usr/share/nginx/html/images/20240210_214816.jpg


# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]