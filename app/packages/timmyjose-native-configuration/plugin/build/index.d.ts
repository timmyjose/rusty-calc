import { ConfigPlugin } from 'expo/config-plugins';
declare const withMyApiKey: ConfigPlugin<{
    apiKey: string;
}>;
export default withMyApiKey;
