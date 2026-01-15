import { useLazyQuery, useMutation } from "@apollo/client"
import { queries, mutations } from "../graphql/customer"
import { toast } from "sonner"

interface TravelerData {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  birthDate?: Date
  gender?: string
  nationality?: string
}

export const useFindOrCreateCustomer = () => {
  const [findCustomer, { loading: searchLoading }] = useLazyQuery(
    queries.customers,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "no-cache",
      onError(error) {
        console.error("Error finding customer:", error)
      },
    }
  )

  const [createCustomer, { loading: createLoading }] = useMutation(
    mutations.addCustomer,
    {
      onError(error) {
        toast.error("Failed to create customer: " + error.message)
      },
    }
  )

  const handleFindOrCreateCustomer = async (
    traveler: TravelerData
  ): Promise<string | null> => {
    try {
      // First, try to find customer by email if email is provided
      if (traveler.email) {
        const { data: searchData } = await findCustomer({
          variables: {
            type: "customer",
            searchValue: traveler.email,
          },
        })

        const existingCustomer = searchData?.customersMain?.list?.[0]

        if (existingCustomer?._id) {
          return existingCustomer._id
        }
      }

      // If not found, create new customer
      // Convert gender string to sex number: "male" = 1, "female" = 2, default = 0
      let sex = 0
      if (traveler.gender === "male") {
        sex = 1
      } else if (traveler.gender === "female") {
        sex = 2
      }

      const { data: createData } = await createCustomer({
        variables: {
          firstName: traveler.firstName,
          lastName: traveler.lastName,
          primaryEmail: traveler.email || undefined,
          primaryPhone: traveler.phone || undefined,
          sex: sex,
          state: "customer",
        },
      })

      if (createData?.customersAdd?._id) {
        return createData.customersAdd._id
      }

      return null
    } catch (error) {
      console.error("Error in handleFindOrCreateCustomer:", error)
      toast.error("Failed to find or create customer")
      return null
    }
  }

  return {
    handleFindOrCreateCustomer,
    loading: searchLoading || createLoading,
  }
}
