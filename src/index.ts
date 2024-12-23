// `dot` is the name we gave to `npx papi add`
import { assethub } from "@polkadot-api/descriptors"
import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider";
import { chainSpec } from "polkadot-api/chains/polkadot_asset_hub";
import { chainSpec as relayChainSpec } from "polkadot-api/chains/polkadot";
import { start } from "polkadot-api/smoldot";


const smoldot = start();

async function main() {
    // The Polkadot Relay Chain
    const relayChain = await smoldot.addChain({ chainSpec: relayChainSpec })
    // Polkadot AssetHub - we include the relay chain as a "potential relay chain", as this is part of smoldot to check the chainspec for what relay chain a parachain uses
    const assetHub = await smoldot.addChain({ chainSpec, potentialRelayChains: [relayChain] });
    // Combine it and make a client!
    const client = createClient(
        getSmProvider(assetHub)
    );

    // To interact with the chain, you need to get the `TypedApi`, which includes
    // all the types for every call in that chain:
    const dotApi = client.getTypedApi(assethub);

    // Then, you can make calls like this...
    // const asset = await (await dotApi.query.Assets.Asset.getEntries()).map((entry) => entry.keyArgs[0])
    // console.log(asset)
}

main()