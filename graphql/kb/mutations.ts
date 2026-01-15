import { gql } from "@apollo/client"

const saveBrowserInfo = gql`
  mutation widgetsSaveBrowserInfo(
    $customerId: String
    $visitorId: String
    $browserInfo: JSON!
  ) {
    widgetsSaveBrowserInfo(
      customerId: $customerId
      visitorId: $visitorId
      browserInfo: $browserInfo
    ) {
      customer {
        _id
        location
      }
    }
  }
`

const mutations = {
  saveBrowserInfo,
}

export default mutations
