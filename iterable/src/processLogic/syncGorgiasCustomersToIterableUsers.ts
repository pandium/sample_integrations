import GorgiasClient, { ListCustomers200ResponseDataInner } from '@pandium/gorgias-client'
import IterableClient, { SubscribeRequest } from '@pandium/iterable-client'
import { Config } from '../lib.js'

const customerToUserPayload = (customer: ListCustomers200ResponseDataInner, listId: number): SubscribeRequest | undefined => {
    try {
        if (!customer.email) {
            throw Error('Customer email not defined')
        }
        
        return {
            listId: listId,
            subscribers: [{
                email: customer.email
            }]
        }
    } catch (error) {
        console.error(`There was an error in transforming GorgiasClient customer ${customer.id} into IterableClient user payload: ${error}`)
    }
    return
}

export const syncGorgiasCustomersToIterableUsers = async(
    gorgias: GorgiasClient,
    iterable: IterableClient,
    config: Config
) => {
    try {
        const listId = config.list_id
        if (!listId) {
            console.error('Cannot sync gorgias customers to iterable users until user makes a selection for list_id')
            console.error(`-------------- Cancelled sync of gorgias customers to iterable users --------------`)
            return
        }

        const parsedListId = parseInt(listId)
        if (isNaN(parsedListId)) {
            console.error('list_id must be a valid number')
            console.error(`-------------- Cancelled sync of gorgias customers to iterable users --------------`)
            return
        }

        console.error(
            `-------------- Starting to sync gorgias customers to iterable users --------------`
        )
        
        const customersGenerator = gorgias.listCustomers({})
        for await (const customer of customersGenerator) {
            const userPayload = customerToUserPayload(customer, parsedListId)
            if (!userPayload) continue

            try {
                await iterable.addListSubscriber({ body: userPayload })
                console.error(`✅ Successfully created a IterableClient user for GorgiasClient customer ${customer.id}`)
            } catch (error) {
                console.error(`❌ There was an error in creating IterableClient user based on GorgiasClient customer ${customer.id}: ${JSON.stringify((error as any).response?.data) || error}, ${JSON.stringify(userPayload)}`)
            }
        }
        console.error(
            `-------------- Completed syncing gorgias customers to iterable users --------------`
        )
    } catch (error) {
        console.error(`Unexpected error: ${error}`)
        console.error(
            `-------------- Stopped syncing gorgias customers to iterable users --------------`
        )
    }
}