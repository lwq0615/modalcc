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
    if (typeof func !== 'function') {
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
  #emits = {}
  addEmit(names, handle) {
    if (!names || !handle) {
      return
    }
    if (!Array.isArray(names)) {
      names = [names]
    }
    for (const name of names) {
      if (this.#emits[name]) {
        this.#emits[name].push(handle)
      } else {
        this.#emits[name] = [handle]
      }
    }
  }
  invokeEmit(name, ...args) {
    if (!this.#emits[name]) {
      return
    }
    for (const handle of this.#emits[name]) {
      handle(...args)
    }
  }
}

function getModalInstance() {
  return useAttrs()[modalSymbol]
}

const modalSymbol = '__modalcc'
function useModal(component, modalComponent = modalVue) {
  let props = {}
  let slots = {}
  if (Array.isArray(component)) {
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
  const exposed = new Proxy(instance.component.exposed, {
    get(target, key) {
      if(typeof target[key] === 'function' && !target[key].toString().startsWith('class')) {
        return function(...args) {
          setTimeout(() => modal.invokeEmit(key, ...args), 0)
          return target[key](...args)
        }
      }else {
        return target[key]
      }
    }
  })
  Reflect.defineMetadata(modalSymbol, modal, exposed)
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

function onEmit(names, handle, modalExpose) {
  let modal = null
  if (modalExpose) {
    modal = Reflect.getMetadata(modalSymbol, modalExpose)
  } else {
    modal = getModalInstance()
  }
  if (!modal) {
    throw new Error('onEmit在非模态框内嵌组件内调用时，需要传入useModal的返回值作为第2个参数，指定要监听的模态框')
  }
  modal.addEmit(names, handle)
}