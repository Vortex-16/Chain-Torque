export const CONTRACT_ADDRESS = "0x412085b60cC5F479582fCdB165Ec2ECf9A85Bf79";
export const MARKETPLACE_ABI = [
    "function purchaseToken(uint256 tokenId) external payable",
    "function createToken(string memory tokenURI, uint128 price, uint32 category, uint24 royalty) external payable returns (uint256)",
    "function getListingPrice() external view returns (uint256)",
    "event MarketItemSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint128 price)",
    "event MarketItemCreated(uint256 indexed tokenId, address indexed seller, uint128 indexed price, uint32 category, uint256 timestamp)"
];
