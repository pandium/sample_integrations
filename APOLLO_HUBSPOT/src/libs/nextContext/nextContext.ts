import { ContextResourceProperties, ContextResources } from './types'

export default class NextContext {
    resources: ContextResources = {}

    updateResourceContext = (
        resource: string,
        property: keyof ContextResourceProperties,
        newPropertyValue: string
    ) => {
        if (!this.resources[resource]) {
            this.resources[resource] = {}
        }
        this.resources[resource][property] = newPropertyValue
    }
}
