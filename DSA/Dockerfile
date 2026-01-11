FROM ubuntu:24.04

# Install g++
RUN apt update && \
    apt install -y g++ && \
    rm -rf /var/lib/apt/lists/*

# Set working directory inside container 
#Create a folder named app inside the container and go into it.
# /app
#  ├── Practice.cpp
#  ├── README.md
#  ├── DSA/
#  └── Dockerfile
WORKDIR /app

# Copy everything from your project into the container copy all the folder 
COPY . .
z
# When the container starts, open a terminal and wait for me.
#If there is no CMD ["bash"]:
# Container starts
# Does nothing
# Stops immediately ❌
# You won’t see anything.
CMD ["bash"]
