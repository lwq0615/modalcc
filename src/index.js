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

function getModalInstance() {
  return useAttrs()[modalSymbol]
}

const modalSymbol = '__modalcc'
function useModal(component, modalComponent = modalVue) {
  let props = {}
  let slots = {}
  if(Array.isArray(component)) {
    component = component[0]
    props = component[1] || {}
    slots = component[2] || {}
  }
  const modal = new ModalInstance()
  props[modalSymbol] = modal
  const instance = h(modalComponent, {
    [modalSymbol]: modal
  }, {
    default: () => h(Suspense, null, {
      default: () => h(component, props, slots),
    }),
  })
  instance.appContext = app._context
  render(instance, document.body)
  const exposed = instance.component.exposed
  modal.setExposed(exposed)
  return exposed
}

function withModal(props) {
  const modal = getModalInstance()
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
  const modal = getModalInstance()
  if (!modal) {
    return
  }
  modal.addInitTask(func)
}