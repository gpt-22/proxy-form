export type FormField = {
  id: string
  type: string
  placeholder: string
  hint: string
  value: string
  isValid: boolean
}

export type Form = {
  title: string
  fieldEmail: FormField
  fieldPassword: FormField
  submitButtonText: string
  isValid: boolean
}

export const form: Form = {
  title: 'Вход',
  fieldEmail: {
    id: 'field-email',
    type: 'email',
    placeholder: 'Введите email',
    hint: '',
    value: '',
    isValid: false
  },
  fieldPassword: {
    id: 'field-password',
    type: 'password',
    placeholder: 'Введите пароль',
    hint: '',
    value: '',
    isValid: false
  },
  submitButtonText: 'Войти',
  isValid: false
}
