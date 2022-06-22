import './style.css'

import { Form, FormField, form } from './data'
import { caseConverter, getEmailValid, getPasswordValid } from './utils'

const createFieldHTMLElement = (field: FormField): HTMLElement => {
  const element = document.createElement('label')
  element.id = field.id
  element.className = 'field'

  element.innerHTML = `
    <input type="${field.type}" value="${field.value}" placeholder="${field.placeholder}" class="input">
    <div class="field-hint">${field.hint}</div>
  `

  element.addEventListener('input', (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      const newValue = event.target.value
      const fieldId = event.target.labels[0].id
      const field = Object.entries(formProxy).find((entry) => {
        const value = entry[1] as FormField
        return value.id === fieldId
      })[1] as FormField

      if (field) {
        field.value = newValue

        const fieldPropName = caseConverter.toCamel(fieldId)
        formProxy[fieldPropName] = field
      }
    }
  })

  return element
}

const createFormHTMLElement = (form: Form): HTMLElement => {
  const element = document.createElement('form')
  element.id = element.className = 'form'

  element.innerHTML = `
    <form id="form" action="" class="form">
      <h1 class="form-title">${form.title}</h1>

      <div class="form-body"></div>

      <button type="submit" class="button button-submit" ${form.isValid ? '' : 'disabled'}>
        ${form.submitButtonText}
      </button>
    </form>
  `

  const formBody = element.getElementsByClassName('form-body')[0]
  fieldNodes.forEach((fieldNode) => formBody.append(fieldNode))

  const submitButton = element.querySelector('button[type=submit]')
  submitButton.addEventListener('click', (event: Event) => {
    event.preventDefault()
    console.log('submit')
  })

  return element
}

const formProxy = new Proxy(form, {
  set: (obj, prop: string, value) => {
    console.log('set', caseConverter.toKebab(prop), value)

    onFormChange(prop, value)

    obj[prop] = value

    return true
  }
})

const onFormChange = (prop, value) => {
  const propId = caseConverter.toKebab(prop)
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
}

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

export const fieldNodes = [
  createFieldHTMLElement(form.fieldEmail),
  createFieldHTMLElement(form.fieldPassword)
]
export const formNode = createFormHTMLElement(formProxy)

const app = document.querySelector<HTMLDivElement>('#app')!

const renderForm = () => {
  app.append(formNode)
}

renderForm()
