// `dot` is the name we gave to `npx papi add`
import { assethub } from "@polkadot-api/descriptors"
import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider";
import { getWsProvider } from "polkadot-api/ws-provider/node";
import { chainSpec } from "polkadot-api/chains/polkadot_asset_hub";
import { chainSpec as relayChainSpec } from "polkadot-api/chains/polkadot";
import { start } from "polkadot-api/smoldot";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";


const smoldot = start();

async function main() {

    // !!! COMMENT THIS IF YOU DON'T WANT TO USE THE LIGHT CLIENT !!!
    // The Polkadot Relay Chain
    const relayChain = await smoldot.addChain({ chainSpec: relayChainSpec })
    // Polkadot AssetHub - we include the relay chain as a "potential relay chain", as this is part of smoldot to check the chainspec for what relay chain a parachain uses
    const assetHub = await smoldot.addChain({ chainSpec, potentialRelayChains: [relayChain] });

    // Combine it and make a client!
    const client = createClient(
        getSmProvider(assetHub)
    );

    // !!! COMMENT THIS IF YOU DON'T WANT TO USE THE LIGHT CLIENT !!!

    // For custom chain options, uncomment the following and add your custom URL (such as: localhost). You may also comment out the above client in this case.
    // const client = createClient(
    //     // Polkadot-SDK Nodes have issues, we recommend adding this enhancer
    //     // see Requirements page for more info
    //     withPolkadotSdkCompat(
    //         getWsProvider("wss://polkadot-asset-hub-rpc.polkadot.io")
    //     )
    // );

    // To interact with the chain, you need to get the `TypedApi`, which includes
    // all the types for every call in that chain:
    const dotApi = client.getTypedApi(assethub);

    // Then, you can make calls like this...
    const asset = await (await dotApi.query.Assets.Asset.getEntries()).map((entry) => entry.keyArgs[0])
    console.log(asset)
}

main()