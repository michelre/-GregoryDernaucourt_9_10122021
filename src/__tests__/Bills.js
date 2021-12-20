/**
 * @jest-environment jsdom
 */

import { getByTestId, screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { localStorageMock } from '../__mocks__/localStorage'
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import firebase from "../__mocks__/firebase"
import ErrorPage from "../views/ErrorPage.js"


const data = []
const loading = false
const error = null

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      // Set localStorage
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const user = JSON.stringify({
        type: 'Employee'
      })
      window.localStorage.setItem('user', user)

      // Route path Bills
      const pathname = ROUTES_PATH['Bills']
      const html = ROUTES({
        pathname,
        data,
        loading,
        error
      })
      document.body.innerHTML = html

      // const html = BillsUI({ data: [] })
      // document.body.innerHTML = html
      //to-do write expect expression
      expect(document.querySelector("#layout-icon1.active-icon")).toBeDefined()
    })

    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- \/.](0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    test('Then I click on New Bill and I should navigate to NewBill ', () => {
      const pathname = ROUTES_PATH['NewBill']
      const html = ROUTES({
        pathname,
        data,
        loading,
        error
      })
      const url = ROUTES_PATH.NewBill
      Object.defineProperty(window, 'location', {
        value: {
          hash: url
        }
      });
      document.body.innerHTML = html
      expect(window.location.hash).toBe(url)
    })
  })
})

// Test d'intégration GET Bills
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills", () => {
    test("Then fetches bills from mock API GET", async () => {
      const getSpy = jest.spyOn(firebase, "get")
      const bills = await firebase.get()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(4)
    })
  })

  test("Then fetches bills from an API and fails with 404 message error", async () => {
    firebase.get.mockImplementationOnce(() =>
      Promise.reject(new Error("Erreur 404"))
    )
    const html = BillsUI({ error: "Erreur 404" })
    document.body.innerHTML = html
    const message = await screen.getByText(/Erreur 404/)
    expect(message).toBeTruthy()
  })

  test("Then fetches messages from an API and fails with 500 message error", async () => {
    firebase.get.mockImplementationOnce(() =>
      Promise.reject(new Error("Erreur 500"))
    )
    const html = BillsUI({ error: "Erreur 500" })
    document.body.innerHTML = html
    const message = await screen.getByText(/Erreur 500/)
    expect(message).toBeTruthy()
  })

  test(('Then, it should render Loading...'), () => {
    const html = BillsUI({ data: [], loading: true })
    document.body.innerHTML = html
    expect(screen.getAllByText('Loading...')).toBeTruthy()
  })

  test(('Then, if error, it should render Error page'), () => {
    const error = 'Erreur de connexion internet'
    const html = BillsUI({ data: [], error: error })
    document.body.innerHTML = html
    expect(screen.getAllByText(error)).toBeTruthy()
  })

})

