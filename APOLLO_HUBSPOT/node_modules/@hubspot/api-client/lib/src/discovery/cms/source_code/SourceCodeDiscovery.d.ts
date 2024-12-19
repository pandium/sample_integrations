import { ContentApi, ExtractApi, MetadataApi, SourceCodeExtractApi, ValidationApi } from '../../../../codegen/cms/source_code/index';
import IConfiguration from '../../../configuration/IConfiguration';
export default class SourceCodeDiscovery {
    contentApi: ContentApi;
    extractApi: ExtractApi;
    metadataApi: MetadataApi;
    sourceCodeExtractApi: SourceCodeExtractApi;
    validationApi: ValidationApi;
    constructor(config: IConfiguration);
}
