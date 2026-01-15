import { gql } from "@apollo/client"

const addCustomer = gql`
  mutation customersAdd(
    $firstName: String
    $lastName: String
    $primaryEmail: String
    $primaryPhone: String
    $registrationNumber: String
    $state: String
    $sex: Int
  ) {
    customersAdd(
      firstName: $firstName
      state: $state
      lastName: $lastName
      primaryEmail: $primaryEmail
      primaryPhone: $primaryPhone
      registrationNumber: $registrationNumber
      sex: $sex
    ) {
      _id
    }
  }
`

const editCustomer = gql`
  mutation customersEdit(
    $_id: String!
    $sex: Int
  ) {
    customersEdit(
      _id: $_id
      sex: $sex
    ) {
      _id
      sex
    }
  }
`

const mutations = { addCustomer, editCustomer }

export default mutations
