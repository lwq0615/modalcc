let app
let modalVue

function init(appMain, modal) {
  app = appMain
  modalVue = modal
}

class ModalInstance {
  setConfig(config) {
    this.getExposed().setConfig?.(config)
  }

  #exposed = null
  setExposed(exposed) {
    this.#exposed = exposed
  }

  getExposed() {
    return this.#exposed
  }
}

const modalStack = []
function useModal(component) {
  const modal = new ModalInstance()
  modalStack.push(modal)
  const instance = h(modalVue, null, {
    default: () => h(component),
  })
  instance.appContext = app._context
  render(instance, document.body)
  const exposed = instance.component.exposed
  modal.setExposed(exposed)
  modalStack.splice(0)
  return exposed
}

function withModal(config) {
  return new Promise((resolve) => {
    void Promise.resolve().then(() => {
      const modal = modalStack.pop()
      modal?.setConfig(config)
      resolve(modal.getExposed())
    })
  })
}