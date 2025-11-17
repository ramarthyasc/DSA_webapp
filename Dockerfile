# FROM - takes a Base image. The Base image contains the File System, and the Dependencies the Container needs to run the Project
FROM node:22.17.1
WORKDIR /usr/src/draw-code
COPY . .
# Next, install all packages - as i didin't copy node_modules folder into this container filesystem path
# clean install - doesn't change the lock file.
# You can have multiple RUNs
#
# INSTALL GIT
# INSTALL ALL OTHER EXTERNAL DEPENDENCIES TOO
# INSTALL POSTGRES SERVER TOO & THEN CMD IT IN THE BACKGROUND TOO.
RUN npm ci


# Expose ports : 
# 5173 = Vite frontend server's listening port
# 5000 = Express backend's listening port
# 
EXPOSE 5173 5000

## The above commands run when you're creating the image - NOTE : TO BAKE THE IMAGE or BURN THE IMAGE

# Command to run when the Container is run or the Image is run
CMD ["/usr/src/draw-code/start.sh"]
