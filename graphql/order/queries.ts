import { gql } from "@apollo/client"

const invoices = `
  query Invoices($contentType: String, $contentTypeId: String) {
    invoices(contentType: $contentType, contentTypeId: $contentTypeId) {
      _id
      amount
      status
    }
  }
`

const bmOrders = gql`
  query BmOrders($customerId: String) {
    bmOrders(customerId: $customerId) {
      total
      list {
        _id
        branchId
        customerId
        tourId
        amount
        status
        note
        numberOfPeople
        type
        additionalCustomers
        isChild
        parent
      }
    }
  }
`

const queries = {
  invoices,
  bmOrders,
}

export default queries
