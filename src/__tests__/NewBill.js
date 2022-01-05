import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import firebase from "../__mocks__/firebase"
import { ROUTES } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I should be able to send a file", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = firebase
      const newbill = new NewBill({ document, onNavigate, firestore })
      const handleChangeFile = jest.fn(newbill.handleChangeFile)
      const inputData = {
        name: 'jane-roe.jpg',
        _lastModified: 1580400631732,
        get lastModified() {
          return this._lastModified
        },
        set lastModified(value) {
          this._lastModified = value
        },
        size: 703786,
        type: 'image/jpeg'
      }
      const file = screen.getByTestId("file")
      fireEvent.change(file, { target: jest.fn(inputData) })
      file.value = `C:\fakepath\jane-roe.jpg`
      expect(handleChangeFile).toBeCalled()
    })

    test('Then I should submit', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: 'cedric.hiely@billed.com'
      }))
      const firestore = null
      const newbill = new NewBill({ document, onNavigate, firestore })
      const handleSubmit = jest.fn(newbill.handleSubmit)
      const formNewBill = screen.getByTestId("form-new-bill")
      formNewBill.addEventListener('submit', handleSubmit)
      fireEvent.submit(formNewBill)
      expect(handleSubmit).toHaveBeenCalled()

    })

  })

  // Test d'intégration POST new bill
  describe("When I post a new bill", () => {
    //Date remplie
    test('I should have a valid date', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const datepicker = screen.getByTestId('datepicker')
      expect(datepicker).not.toBeNull()
      expect(datepicker.getAttributeNames().find(e => e == 'required')).not.toBeUndefined()
    })

    //Un montant
    test('I should have a number as amount ', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const amount = screen.getByTestId('amount')
      expect(amount).not.toBeNull()
      expect(amount.getAttributeNames().find(e => e == 'required')).not.toBeUndefined()
    })

    //Une tva (pourcentage)
    test('I should have a number as VAT', () => {
      const pct = screen.getByTestId('pct')
      expect(pct).not.toBeNull()
      expect(pct.getAttributeNames().find(e => e == 'required')).not.toBeUndefined()
    })

    //Un fichier à envoyer
    test('I should have a valid file', () => {
      const file = screen.getByTestId('file')
      expect(file).not.toBeNull()
      expect(file.getAttributeNames().find(e => e == 'required')).not.toBeUndefined()
    })

  })
})
