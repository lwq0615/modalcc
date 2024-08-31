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
  getProps() {
    return this.#props
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
  console.log('withModal')
  const modal = modalStack.pop()
  if (!modal) {
    return
  }
  return new Promise((resolve) => {
    Promise.resolve().then(() => {
      modal.setProps(props)
      resolve(modal.getExposed())
    })
  })
}

function useModalProps() {
  console.log('useModalProps')
  return new Promise((resolve) => {
    Promise.resolve().then(() => {
      resolve(modalStack[modalStack.length - 1]?.getProps())
    })
  })
}