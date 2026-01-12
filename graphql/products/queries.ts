import { gql } from "@apollo/client";
import orderQueries from "../order/queries";

const commonFields = `
  _id
  name
  code

`;

const productCategories = gql`
  query poscProductCategories ($parentId: String, $searchValue: String, $excludeEmpty: Boolean, $meta: String, $page: Int, $perPage: Int, $sortField: String, $sortDirection: Int) {
    poscProductCategories(parentId: $parentId, searchValue: $searchValue, excludeEmpty: $excludeEmpty, meta: $meta, page: $page, perPage: $perPage, sortField: $sortField, sortDirection: $sortDirection) {
      ${commonFields}
      order
      parentId
      attachment {
        url
      }
    }
  }
`;

const products = gql`
  query poscProducts(
    $searchValue: String,
    $tag: String
    $type: String, 
    $categoryId: String, 
    $page: Int, 
    $perPage: Int, 
    $isKiosk: Boolean, 
    $groupedSimilarity: String
    $sortField: String
    $sortDirection: Int
    ) {
    poscProducts(
      searchValue: $searchValue, 
      tag: $tag
      categoryId: $categoryId, 
      type: $type, 
      page: $page, 
      perPage: $perPage, 
      isKiosk: $isKiosk, 
      groupedSimilarity: $groupedSimilarity
      sortField: $sortField
      sortDirection: $sortDirection
    )  {
      ${commonFields}
      category {
        name
        _id
      }
      unitPrice
      type
      description
      remainder
      tagIds
      hasSimilarity
      attachment {
        url
      }
    }
  }
`;

const productsByTag = gql`
  query productsByTag($tag: String) {
    poscProducts(tag: $tag) {
      _id
    }
  }
`;

const productsMeta = gql`
  query PoscProductsMeta($perPage: Int) {
    poscProducts(perPage: $perPage, isKiosk: true) {
      _id
      modifiedAt
    }
  }
`;

const productSimilarities = gql`
  query PoscProductSimilarities($id: String!, $groupedSimilarity: String) {
    poscProductSimilarities(_id: $id, groupedSimilarity: $groupedSimilarity) {
      products {
        _id
        description
        unitPrice
        name
        attachment {
          url
        }
        customFieldsData
      }
      groups {
        fieldId
        title
      }
    }
  }
`;

const productsCount = gql`
  query productsCount(
    $categoryId: String
    $type: String
    $searchValue: String
    $groupedSimilarity: String
    $isKiosk: Boolean
  ) {
    poscProductsTotalCount(
      categoryId: $categoryId
      type: $type
      searchValue: $searchValue
      groupedSimilarity: $groupedSimilarity
      isKiosk: $isKiosk
    )
  }
`;

const getPriceInfo = gql`
  query getPriceInfo($productId: String!) {
    getPriceInfo(productId: $productId)
  }
`;

const getInitialCategory = gql`
  query InitialCategory($_id: String) {
    poscProductCategoryDetail(_id: $_id) {
      _id
      name
      attachment {
        url
      }
    }
  }
`;

const getKioskCategory = getInitialCategory;

const productDetail = gql`
  query ProductDetail($_id: String) {
    poscProductDetail(_id: $_id) {
      _id
      name
      description
      code
      type
      createdAt
      unitPrice
      remainder
      category {
        order
        name
        _id
      }
      attachment {
        url
      }
      attachmentMore {
        url
      }
    }
  }
`;

const productReview = gql`
  query Productreview($productId: String!) {
    productreview(productId: $productId) {
      average
      length
      productId
    }
  }
`;

const getLastProductView = orderQueries.getLastProductView;

const getProductReviews = gql`
  query Productreviews($productIds: [String], $customerId: String) {
    productreviews(productIds: $productIds, customerId: $customerId) {
      _id
      customerId
      review
    }
  }
`;

const getProductAverageReview = productReview;

const msdProductsRemainder = gql`
  query msdProductsRemainder($posToken: String, $productCodes: [String]) {
    msdProductsRemainder(posToken: $posToken, productCodes: $productCodes)
  }
`;

const queries = {
  productCategories,
  products,
  productsCount,
  productSimilarities,
  productDetail,
  productsMeta,
  productReview,
  getLastProductView,
  getProductAverageReview,
  getProductReviews,
  msdProductsRemainder,
  productsByTag,
};
export default queries;
