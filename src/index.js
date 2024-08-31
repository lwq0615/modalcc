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
  #modalInitTask = []
  addInitTask(func) {
    if(typeof func !== 'function') {
      return
    }
    this.#modalInitTask.push(func)
  }
  invokeModalInit() {
    for (const task of this.#modalInitTask) {
      task(this.getProps())
    }
  }

  #exposed
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
    default: () => h(Suspense, null, {
      default: () => h(component),
    }),
  })
  instance.appContext = app._context
  render(instance, document.body)
  const exposed = instance.component.exposed
  modal.setExposed(exposed)
  return exposed
}

function withModal(props) {
  const modal = modalStack.pop()
  if (!modal) {
    return
  }
  return new Promise((resolve) => {
    Promise.resolve().then(() => {
      modal.setProps(props)
      modal.invokeModalInit()
      resolve(modal.getExposed())
    })
  })
}

function onModalInit(func) {
  const modal = modalStack[modalStack.length - 1]
  if (!modal) {
    return
  }
  modal.addInitTask(func)
}