import { gql } from '@apollo/client';

const productreviews = gql`
  query productreviews(
    $productIds: [String]
    $customerId: String
    $page: Int
    $perPage: Int
  ) {
    productreviews(
      productIds: $productIds
      customerId: $customerId
      page: $page
      perPage: $perPage
    ) {
      _id
      productId
      customerId
      review
      description
      info
    }
  }
`;

const wishlist = gql`
  query Wishlist($customerId: String, $page: Int, $perPage: Int) {
    wishlist(customerId: $customerId, page: $page, perPage: $perPage) {
      _id
      customerId
      product {
        _id
        name
        description
        unitPrice
        remainder
        attachment {
          url
        }
      }
    }
  }
`;

const queries = {
  productreviews,
  wishlist,
};

export default queries;
