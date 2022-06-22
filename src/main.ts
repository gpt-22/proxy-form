import './style.css'

import {form} from './data'
import caseConverter from './id-converter'


function getEmailValid(email: string): boolean {
  return (
    email.includes('@') &&
    email.split('@')[0].length >= 3 &&
    (email.includes('.ru') || email.includes('.com'))
  )
}

function getPasswordValid(password: string): boolean {
  return /.{6,}/.test(password)
}

// @ts-ignore
const getFieldNode = (field) => {
  const node = document.createElement('label')
  node.id = field.id
  node.className = 'field'

  node.innerHTML = `
    <input type="${field.type}" value="${field.value}" placeholder="${field.placeholder}" class="input">
    <div class="field-hint">${field.hint}</div>
  `

  node.addEventListener('input', (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      const newValue = event.target.value

      const fieldId = event.target.labels[0].id

      // @ts-ignore
      const field = Object.entries(formProxy).find((entry) => entry[1]?.id === fieldId)[1]
      if (field) {
        // @ts-ignore
        field.value = newValue

        const fieldPropName = caseConverter.toCamel(fieldId)

        formProxy[fieldPropName] = field
      }

    }
  })

  return node
}

const createFormNode = (form) => {
  const node = document.createElement('form')
  node.id = node.className = 'form'

  node.innerHTML = `
    <form id="form" action="" class="form">
      <h1 class="form-title">${form.title}</h1>

      <div class="form-body"></div>

      <button type="submit" class="button button-submit" ${ form.isValid ? '' : 'disabled' }>
        ${form.submitButtonText}
      </button>
    </form>
  `

  const formBody = node.getElementsByClassName('form-body')[0]
  fieldNodes.forEach((fieldNode) => formBody.append(fieldNode))

  const submitButton = node.querySelector('button[type=submit]')
  submitButton.addEventListener('click', (event: Event) => {
    event.preventDefault()
    console.log('submit')
  })

  return node
}

const formProxy = new Proxy(form, {
  get: (target, name) => {
    console.log('get')

    return target[name]
  },
  // @ts-ignore
  set: (obj: object, prop: string, value) => {
    console.log('set', caseConverter.toSnake(prop), form.fieldEmail.id, value)

    const propId = caseConverter.toSnake(prop)
    switch (propId) {
      case form.fieldEmail.id:
        onEmailChange(value.value)
        break
      case form.fieldPassword.id:
        onPasswordChange(value.value)
    }

    form.isValid = form.fieldEmail.isValid && form.fieldPassword.isValid

    const submitButton: HTMLButtonElement = formNode.querySelector('button[type=submit]')
    submitButton.disabled = !form.isValid

    obj[prop] = value
  }
})


const onEmailChange = (value: string) => {
  const hintEl = fieldNodes[0].querySelector('.field-hint')

  const emailValid = getEmailValid(value)
  formProxy.fieldEmail.isValid = emailValid
  formProxy.fieldEmail.hint = emailValid ? '' : 'Некорректный email'
  hintEl.innerHTML = formProxy.fieldEmail.hint
}

const onPasswordChange = (value: string) => {
  const hintEl = fieldNodes[1].querySelector('.field-hint')

  const passwordValid = getPasswordValid(value)
  formProxy.fieldPassword.isValid = passwordValid
  formProxy.fieldPassword.hint = passwordValid ? '' : 'Слабый пароль'
  hintEl.innerHTML = formProxy.fieldPassword.hint
}

export const fieldNodes = [getFieldNode(form.fieldEmail), getFieldNode(form.fieldPassword)]
export const formNode = createFormNode(formProxy)


const app = document.querySelector<HTMLDivElement>('#app')!

const renderForm = () => {
  app.append(formNode)
}

renderForm()
