import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ItemBought as ItemBoughtEvent,
  ItemDeleted as ItemDeletedEvent,
  ItemListed as ItemListedEvent
} from "../generated/NftMarketplace/NftMarketplace"
import { ItemBought, ItemDeleted, ItemListed, ActiveItem} from "../generated/schema"

export function handleItemBought(event: ItemBoughtEvent): void {

  let itemBought = ItemBought.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  
  if (!itemBought) {
    itemBought = new ItemBought(
        getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
}


itemBought.buyer = event.params.buyer
itemBought.nftAddress = event.params.nftAddress
itemBought.tokenId = event.params.tokenId
itemBought.price = event.params.price
activeItem!.buyer = event.params.buyer

  itemBought.save()
  activeItem!.save()
}

export function handleItemDeleted(event: ItemDeletedEvent): void {
  let itemDeleted =  ItemDeleted.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
   )
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))

  if(!itemDeleted) {
    itemDeleted = new ItemDeleted(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  }

  itemDeleted.seller = event.params.seller
  itemDeleted.nftAddress = event.params.nftAddress
  itemDeleted.tokenId = event.params.tokenId
  activeItem!.buyer  = Address.fromString("0x000000000000000000000000000000000000dEaD")


  itemDeleted.save()
  activeItem!.save()
}

export function handleItemListed(event: ItemListedEvent): void {
  let itemListed =  ItemListed.load(
   getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  )
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))

  if(!itemListed) {
    itemListed = new ItemListed(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  }

  if(!activeItem) {
    activeItem = new ActiveItem(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  }

  itemListed.seller = event.params.seller
  activeItem.seller = event.params.seller

  itemListed.nftAddress = event.params.nftAddress
  activeItem.nftAddress = event.params.nftAddress

  itemListed.tokenId = event.params.tokenId
  activeItem.tokenId = event.params.tokenId

  itemListed.price = event.params.price
  activeItem.price = event.params.price

  activeItem.buyer  = Address.fromString("0x000000000000000000000000000000000000dEaD")


  itemListed.save()
  activeItem.save()
}
// 1d79ea37cc0f5a4bbaafc65c21a458d7
function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString()
}