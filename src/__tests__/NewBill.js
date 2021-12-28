import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import firebase from "../__mocks__/firebase"
import { ROUTES } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I should put a file", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      const file = screen.getByTestId("file")
      const onNavigate = jest.fn()
      const firestore = jest.fn()
      const newbill = new NewBill({ document, onNavigate, firestore })
      newbill.handleChangeFile = jest.fn(newbill.handleChangeFile)
      const event = {
        target: {
          files: ['image.jpg']
        }
      }
      fireEvent.change(file, event)
      const fileName = file.files[0]
      expect(fileName).toMatch(/(?:jpg|jpeg|png)/g)
      expect(newbill.handleChangeFile).toHaveBeenCalled()
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
})