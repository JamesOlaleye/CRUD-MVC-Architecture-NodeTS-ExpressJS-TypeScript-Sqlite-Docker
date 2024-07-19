# specify all the configurations

# dockerfile -> docker client (CLI)-> docker server -> usable image

# software dependency libraries os hardware

FROM node:gallium-alpine 

ENV NODE_ENV=development

ENV PORT=8080

WORKDIR /user/app

COPY ./ ./

RUN yarn 

EXPOSE 4000

CMD ["yarn", "start"]



 

