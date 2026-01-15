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

const mutations = { addCustomer }

export default mutations
