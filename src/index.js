let app
let modalVue

function init(appMain, modal) {
  app = appMain
  modalVue = modal
}

class ModalInstance {
  #props
  setProps(props) {
    this.#props = props
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

function withModal(props) {
  const modal = modalStack.pop()
  return new Promise((resolve) => {
    Promise.resolve().then(() => {
      modal?.setProps(props)
      resolve(modal.getExposed())
    })
  })
}