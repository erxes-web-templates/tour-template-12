import { gql } from '@apollo/client';

const wishlistAdd = gql`
  mutation WishlistAdd($productId: String, $customerId: String) {
    wishlistAdd(productId: $productId, customerId: $customerId) {
      _id
      productId
      customerId
    }
  }
`;

const wishlistRemove = gql`
  mutation WishlistRemove($id: String!) {
    wishlistRemove(_id: $id) {
      _id
    }
  }
`;

const addToLastView = gql`
  mutation LastViewedItemAdd($productId: String!, $customerId: String!) {
    lastViewedItemAdd(productId: $productId, customerId: $customerId) {
      _id
    }
  }
`;

const removeLastView = gql`
  mutation LastViewedItemRemove($id: String!) {
    lastViewedItemRemove(_id: $id) {
      _id
      productId
      customerId
    }
  }
`;
export const ReviewAdd = gql`
  mutation ProductreviewAdd(
    $productId: String
    $customerId: String
    $review: Float
  ) {
    productreviewAdd(
      productId: $productId
      customerId: $customerId
      review: $review
    ) {
      _id
      customerId
      productId
      review
    }
  }
`;
export const ReviewRemove = gql`
  mutation ProductreviewRemove($id: String!) {
    productreviewRemove(_id: $id) {
      _id
      review
    }
  }
`;
export const ReviewUpdate = gql`
  mutation ProductreviewUpdate(
    $id: String!
    $productId: String
    $customerId: String
    $review: Float
  ) {
    productreviewUpdate(
      _id: $id
      productId: $productId
      customerId: $customerId
      review: $review
    ) {
      _id
      review
    }
  }
`;

const mutations = {
  wishlistAdd,
  wishlistRemove,
  removeLastView,
  addToLastView,
  ReviewAdd,
  ReviewRemove,
  ReviewUpdate,
};

export default mutations;
