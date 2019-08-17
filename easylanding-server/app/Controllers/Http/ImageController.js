'use strict'

const Helpers = use('Helpers')
const Image = use('App/Models/Image')
const Property = use('App/Models/Property')


class ImageController {

  async show({ params, response }) {
    return response.download(Helpers.tmpPath(`uploads/${params.path}`))
  }

  async store({ params, request }) {
    const property = await Property.findOrFail(params.id)
    /**
     * o request.file que nos trás um ou mais arquivos com o nome do primeiro
     * parâmetro e ainda podemos limitar para arquivos apenas do tipo de imagem
     *  com tamanho até 2mb.
     */
    const images = request.file('image', {
      types: ['image'],
      size: '2mb'
    })

    /**
     * aqui estou movendo TODAS imagens para uma pasta tmp/uploads no Adonis e
     * para cada arquivo estou alterando o nome do mesmo com o timestamp atual
     * evitando arquivos duplicados.
     */
    await images.moveAll(Helpers.tmpPath('uploads'), file => ({
      name: `${Date.now()}-${file.clientName}`
    }))

    if (!images.movedAll()) {
      return images.errors()
    }

    /**
     * estamos percorrendo todas imagens salvas e cadastrando dentro do imóvel,
     * isso só é possível pois dentro do nosso model de imóvel temos um método
     * images() que é o relacionamento de imóvel com imagens.
     */
    await Promise.all(
      images
        .movedList()
        .map(image => property.images().create({ path: image.fileName }))
    )
  }
}

module.exports = ImageController
