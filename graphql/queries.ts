import { gql } from "@apollo/client"

export const TOURS_QUERY = gql`
  query BmTours($page: Int, $perPage: Int, $status: String) {
    bmTours(page: $page, perPage: $perPage, status: $status) {
      total
      list {
        _id
        content
        startDate
        endDate
        cost
        viewCount
        name
        images
        imageThumbnail
        itineraryId
        itinerary {
          images
        }
        refNumber
        groupSize
      }
    }
  }
`

export const TOUR_DETAIL_QUERY = gql`
  query BmTourDetail($id: String!, $branchId: String) {
    bmTourDetail(_id: $id, branchId: $branchId) {
      _id
      branchId
      content
      cost
      duration
      name
      status
      startDate
      refNumber
      viewCount
      images
      imageThumbnail
      groupSize
         itinerary {
        groupDays {
          day
          images
          content
          elements {
            elementId
            element {
              _id
              name
              icon
              cost
              categories
              quick
              duration
              startTime
              categoriesObject {
                _id
                name
                parentId
              }
            }
            orderOfDay
          }
          elementsQuick {
            elementId
            element {
              _id
              name
              quick
              icon
              cost
              duration
              content
              note
              categories
              categoriesObject {
                _id
                name
                parentId
              }
            }
            orderOfDay
          }
        }
      } 
    }
  }
`

export const CP_GET_CONFIG = gql`
  query clientPortalGetConfig($_id: String!) {
    clientPortalGetConfig(_id: $_id) {
      _id
      name
      template
      templateId
      url
      externalLinks
      copyright
      keywords
      kind
      description
      logo
      icon
      headerHtml
      footerHtml
      domain
      dnsStatus
      messengerBrandCode
      knowledgeBaseLabel
      knowledgeBaseTopicId
      ticketLabel
      dealLabel
      purchaseLabel
      taskPublicPipelineId
      taskPublicBoardId
      taskPublicLabel
      taskLabel
      taskStageId
      taskPipelineId
      taskBoardId
      ticketStageId
      ticketPipelineId
      ticketBoardId
      dealStageId
      dealPipelineId
      dealBoardId
      purchaseStageId
      purchasePipelineId
      purchaseBoardId
      styles {
        bodyColor
        headerColor
        footerColor
        helpColor
        backgroundColor
        activeTabColor
        baseColor
        headingColor
        linkColor
        linkHoverColor
        baseFont
        headingFont
        dividerColor
        primaryBtnColor
        secondaryBtnColor
      }
      mobileResponsive
      googleCredentials
      googleClientId
      googleClientSecret
      googleRedirectUri
      facebookAppId
      erxesAppToken
      kbToggle
      publicTaskToggle
      ticketToggle
      taskToggle
      dealToggle
      purchaseToggle
      otpConfig {
        smsTransporterType
        content
        codeLength
        loginWithOTP
        expireAfter
        emailSubject
      }
      twoFactorConfig {
        smsTransporterType
        content
        codeLength
        enableTwoFactor
        expireAfter
        emailSubject
      }
      mailConfig {
        subject
        invitationContent
        registrationContent
      }
      manualVerificationConfig {
        userIds
        verifyCustomer
        verifyCompany
      }
      passwordVerificationConfig {
        verifyByOTP
        emailSubject
        emailContent
        smsContent
      }
      socialpayConfig {
        certId
        publicKey
      }
      testUserEmail
      testUserPhone
      testUserPassword
      testUserOTP
      tokenExpiration
      refreshTokenExpiration
      tokenPassMethod
      vendorParentProductCategoryId
      language
    }
  }
`

export const GET_CMS_PAGE = gql`
  query CmsPage($id: String, $slug: String) {
    cmsPage(_id: $id, slug: $slug) {
      _id
      name
      content
      createdAt
      updatedAt
      pageItems {
        type
        content
        order
        contentType
        contentTypeId
        config
      }
    }
  }
`

export const GET_CMS_MENU = gql`
  query CmsMenu($id: String!) {
    cmsMenu(_id: $id) {
      _id
      url
      parentId
      parent {
        url
        _id
        contentType
        contentTypeID
        icon
        kind
        label
        parentId
        order
      }
    }
  }
`

export const GET_CMS_MENU_LIST = gql`
  query CmsMenuList($clientPortalId: String!, $kind: String) {
    cmsMenuList(clientPortalId: $clientPortalId, kind: $kind) {
      _id
      url
      parentId
      icon
      kind
      label
      contentType
      contentTypeID
      order
    }
  }
`

export const GET_CMS_PAGES = gql`
  query CmsPages($clientPortalId: String!) {
    cmsPages(clientPortalId: $clientPortalId) {
      _id
      name
      type
      slug
      content
      createdAt
      updatedAt
    }
  }
`

export const GET_CMS_POSTS = gql`
  query CmsPosts(
    $clientPortalId: String
    $featured: Boolean
    $categoryId: String
    $categoryIds: [String]
    $searchValue: String
    $status: PostStatus
    $page: Int
    $perPage: Int
    $tagIds: [String]
    $language: String
  ) {
    cmsPosts(
      clientPortalId: $clientPortalId
      featured: $featured
      categoryId: $categoryId
      categoryIds: $categoryIds
      searchValue: $searchValue
      status: $status
      page: $page
      perPage: $perPage
      tagIds: $tagIds
      language: $language
    ) {
      _id
      authorKind
      authorId
      author {
        ... on User {
          _id
          details {
            avatar
            firstName
            lastName
            description
            fullName
          }
          isOwner
        }
      }
      clientPortalId
      title
      slug
      content
      excerpt
      categoryIds
      status
      tagIds
      featured
      thumbnail {
        url
        name
      }
      images {
        url
        name
      }
      audio {
        url
        name
      }
      videoUrl
      createdAt
      updatedAt
      categories {
        _id
        name
      }
      tags {
        _id
        name
      }
    }
  }
`

export const GET_CMS_POST = gql`
  query CmsPost($slug: String, $id: String, $language: String) {
    cmsPost(slug: $slug, _id: $id, language: $language) {
      _id
      authorKind
      authorId
      author {
        ... on User {
          _id
          details {
            avatar
            firstName
            lastName
            description
            fullName
          }
          isOwner
        }
      }
      title
      content
      excerpt
      categoryIds
      tagIds
      status
      featured
      createdAt
      images {
        url
        name
      }
      thumbnail {
        url
        name
      }
      audio {
        url
        name
      }
      videoUrl
      customFieldsData
      categories {
        _id
        name
      }
    }
  }
`

export const GET_CMS_POST_LIST = gql`
  query PostList(
    $clientPortalId: String!
    $type: String
    $featured: Boolean
    $categoryIds: [String]
    $searchValue: String
    $status: PostStatus
    $page: Int
    $perPage: Int
    $tagIds: [String]
    $sortField: String
    $sortDirection: String
  ) {
    cmsPostList(
      clientPortalId: $clientPortalId
      featured: $featured
      type: $type
      categoryIds: $categoryIds
      searchValue: $searchValue
      status: $status
      page: $page
      perPage: $perPage
      tagIds: $tagIds
      sortField: $sortField
      sortDirection: $sortDirection
    ) {
      currentPage
      totalCount
      totalPages
      posts {
        _id
        type
        customPostType {
          _id
          code
          label
          __typename
        }
        authorKind
        author {
          ... on User {
            _id
            username
            email
            details {
              fullName
              shortName
              avatar
              firstName
              lastName
              middleName
              __typename
            }
            __typename
          }
          ... on ClientPortalUser {
            _id
            fullName
            firstName
            lastName
            email
            username
            customer {
              avatar
              __typename
            }
            __typename
          }
          __typename
        }
        categoryIds
        categories {
          _id
          name
          __typename
        }
        featured
        status
        tagIds
        tags {
          _id
          name
          __typename
        }
        authorId
        createdAt
        autoArchiveDate
        scheduledDate
        thumbnail {
          url
          __typename
        }
        title
        updatedAt
        __typename
      }
      __typename
    }
  }
`

export const GET_FORM_DETAIL = gql`
  query FormDetail($id: String!) {
    formDetail(_id: $id) {
      _id
      title
      description
      fields {
        _id
        code
        field
        column
        text
        validation
        name
        content
        contentType
        contentTypeId
        order
        options
        optionsValues
        type
      }
    }
  }
`

export const INQUIRY_FORM = gql`
  query Forms($type: String, $brandId: String, $searchValue: String) {
    forms(type: $type, brandId: $brandId, searchValue: $searchValue) {
      _id
      name
      title
      code
      type
      description
      buttonText
      createdDate
      numberOfPages
      status
      googleMapApiKey
      fields {
        _id
        contentType
        contentTypeId
        name
        isVisible
        isVisibleInDetail
        canHide
        groupId
        lastUpdatedUserId
        optionsValues
        subFieldIds
        description
        options
        type
        validation
        regexValidation
        text
        content
        isRequired
        order
        associatedFieldId
        logicAction
        column
        pageNumber
        code
        searchable
        showInCard
        isVisibleToCreate
        productCategoryId
        field
        isDefinedByErxes
        relationType
        isDisabled
      }
    }
  }
`

export const TOURS_GROUP_QUERY = gql`
  query bmToursGroup(
    $page: Int
    $perPage: Int
    $tags: [String]
    $status: String
    $branchId: String
  ) {
    bmToursGroup(
      page: $page
      perPage: $perPage
      tags: $tags
      status: $status
      branchId: $branchId
    ) {
      list {
        _id
        items {
          _id
          branchId
          name
          refNumber
          groupCode
          content
          duration
          itineraryId
          startDate
          endDate
          groupSize
          status
          cost
          createdAt
          modifiedAt
          viewCount
          advanceCheck
          advancePercent
          joinPercent
          tagIds
          info1
          info2
          info3
          info4
          info5
          images
          imageThumbnail
             itinerary {
        groupDays {
          day
          images
          content
          elements {
            elementId
            element {
              _id
              name
              icon
              cost
              categories
              quick
              duration
              startTime
              categoriesObject {
                _id
                name
                parentId
              }
            }
            orderOfDay
          }
          elementsQuick {
            elementId
            element {
              _id
              name
              quick
              icon
              cost
              duration
              content
              note
              categories
              categoriesObject {
                _id
                name
                parentId
              }
            }
            orderOfDay
          }
        }
      }
        }
      }
    }
  }
`

export const TOUR_GROUP_DETAIL_QUERY = gql`
  query BmToursGroupDetail($groupCode: String, $status: String) {
    bmToursGroupDetail(groupCode: $groupCode, status: $status) {
      _id
      items {
        _id
        branchId
        name
        refNumber
        groupCode
        content
        duration
        itineraryId
        startDate
        endDate
        groupSize
        status
        cost
        createdAt
        modifiedAt
        viewCount
        advanceCheck
        advancePercent
        joinPercent
        tagIds
        info1
        info2
        info3
        info4
        info5
        images
        imageThumbnail
      }
    }
  }
`
