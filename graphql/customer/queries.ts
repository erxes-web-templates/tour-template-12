import { gql } from "@apollo/client"

const customers = gql`
  query customers($type: String, $ids: [String], $searchValue: String) {
    customersMain(type: $type, ids: $ids, searchValue: $searchValue) {
      list {
        _id
        firstName
        lastName
        primaryEmail
        primaryPhone
        registrationNumber
        sex
      }
      totalCount
    }
  }
`

const queries = { customers }

export default queries
