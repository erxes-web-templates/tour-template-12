import { gql } from "@apollo/client"

const bmOrderAdd = gql`
  mutation BmOrderAdd($order: BmsOrderInput) {
    bmOrderAdd(order: $order) {
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
`

const bmOrderEdit = gql`
  mutation BmOrderEdit($_id: String!, $order: BmsOrderInput) {
    bmOrderEdit(_id: $_id, order: $order) {
      _id
      status
    }
  }
`

const mutations = {
  bmOrderAdd,
  bmOrderEdit,
}

export default mutations
