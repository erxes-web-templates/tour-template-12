import { gql } from "@apollo/client";

const rooms = gql`
  query rooms(
    $pipelineId: String
    $boardId: String
    $categoryId: String
    $perPage: Int
    $page: Int
  ) {
    products(
      pipelineId: $pipelineId
      boardId: $boardId
      categoryId: $categoryId
      perPage: $perPage
      page: $page
    ) {
      _id
      name
      type
      code
      status
      unitPrice
      categoryId
      category {
        _id
        code
        name
        order
        description
      }
      uom
      description
      attachment {
        url
        name
        size
        type
      }
      attachmentMore {
        url
        name
        size
        type
      }
    }
  }
`;

const roomCategories = gql`
  query roomCategories($parentId: String) {
    productCategories(parentId: $parentId) {
      _id
      code
      name
      order
      description
      attachment {
        url
      }
    }
  }
`;

const checkRooms = gql`
  query PmsCheckRooms(
    $pipelineId: String!
    $endDate: Date
    $startDate: Date
    $ids: [String]
  ) {
    pmsCheckRooms(
      pipelineId: $pipelineId
      endDate: $endDate
      startDate: $startDate
      ids: $ids
    ) {
      _id
      name
      type
      code
      status
      unitPrice
      categoryId
      uom
      description
      attachment {
        url
        name
        size
        type
      }
      attachmentMore {
        url
        name
        size
        type
      }
      category {
        _id
        code
        name
        order
        description
      }
    }
  }
`;

const queries = { rooms, roomCategories, checkRooms };
export default queries;
