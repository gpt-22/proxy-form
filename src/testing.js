function createOnChangeProxy(onChange, target) {
  return new Proxy(target, {
    get(target, property) {
      const item = target[property]
      if (item && typeof item === 'object') return createOnChangeProxy(onChange, item)
      return item
    },
    set(target, property, newValue) {
      target[property] = newValue
      onChange(property, newValue)
      return true
    },
  })
}

// let changeCount = 0
// const o = createOnChangeProxy(() => changeCount++, {})
//
// o.foo = 1
// o.bar = 2
// o.baz = {}
// o.baz.lorem = true
// o.baz.yeee = {}
// o.baz.yeee.wooo = 12
//
// console.log(changeCount === 6)
//
// const proxy = createOnChangeProxy(() => console.log('change'), {})
// const baz = {baz: 9, quux: {duck: 6}};
//
// proxy.foo = 5;
// proxy.bar = baz;
// proxy.bar.baz = 10;
// proxy.bar.quux.duck = 999;
//
// baz.quux.duck = 777;
// delete proxy.bar;
// delete proxy.bar; // should not trigger notifcation -- property was already deleted
// baz.quux.duck = 666;  // should not trigger notification -- 'bar' was detached
//
// console.log(proxy);

const form = {
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


const formProxy = createOnChangeProxy((p, v) => {
  console.log('form change', p, v)
}, form)

formProxy.fieldEmail.value = '123'

