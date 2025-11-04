import { gql } from '@apollo/client';

const payment = gql`
  query Payments {
    payments {
      _id
      name
      kind
      status
      config
      createdAt
    }
  }
`;

const queries = { payment };

export default queries;
