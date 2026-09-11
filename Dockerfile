# Use nginx image
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy the whole static site (see .dockerignore for what is excluded).
# Copying the directory instead of listing files individually means new assets
# — the CV PDF, extra images, favicons — get deployed without editing this file.
COPY . /usr/share/nginx/html/

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
