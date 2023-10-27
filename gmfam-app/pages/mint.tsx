import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { ContractFunctionExecutionError, parseEther } from 'viem';
import { useEffect, useState } from 'react';
import { readContract, prepareWriteContract, writeContract } from '@wagmi/core'
import { useAccount, useContractRead } from 'wagmi';
import {
    Input,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
} from '@chakra-ui/react';
import { FaRegClipboard, FaBars } from "react-icons/fa6";

import GmFam from '../abis/GmFam.json';
import ERC721 from '../abis/ERC721.json';


const Home: NextPage = () => {
    const { address, isConnected } = useAccount();
    const [isClient, setIsClient] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [closeTopContainer, setCloseTopContainer] = useState(false);
    useEffect(() => {
        setIsClient(true);

    }, []);



    const givePermission = () => {
        const inputIds = [
            'gmFam_new_addresss',
            'mint_id',
            'original_addresss',
        ];

        // pasar por todos
        const inputs = inputIds.map((id) => {
            const input = document.getElementById(id) as HTMLInputElement;
            return input.value;
        });

        //marcar cuando falta algun input
        if (inputs.some((input) => input === '')) {
            alert('Please fren fill all the inputs');
            return;
        }

        var srcAddress = inputs[0];
        var tokenId = inputs[1];
        var oldContractAddress = inputs[2];



        prepareWriteContract({
            address: oldContractAddress as '0x${string}',
            abi: ERC721.abi,
            functionName: 'approve',

            args: [
                srcAddress,
                tokenId
            ],
            account: address,
        }).then((data) => {
            writeContract(data).then(() => {
                setPermissionGranted(true);
                alert('Permission granted');
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    const safeMint = () => {
        const inputIds = [
            'gmFam_new_addresss',
            'mint_id',
            'original_addresss',
        ];

        // pasar por todos
        const inputs = inputIds.map((id) => {
            const input = document.getElementById(id) as HTMLInputElement;
            return input.value;
        });

        //marcar cuando falta algun input
        if (inputs.some((input) => input === '')) {
            alert('Please fren fill all the inputs');
            return;
        }

        var mintAddress = inputs[0];
        var tokenId = inputs[1];


        console.log(mintAddress);
        //leer variable costPerMint
        var costPerMint = 0;
        readContract({
            address: mintAddress as '0x${string}',
            abi: GmFam.abi,
            args: [],
            functionName: 'readCost',
        }).then((data) => {
            console.log(data);
            costPerMint = data as number;
        }).then(() => {
            prepareWriteContract({
                address: mintAddress as '0x${string}',
                abi: GmFam.abi,
                functionName: 'safeMint',
                args: [tokenId],
                account: address,
                value: BigInt(costPerMint),

            }).then((data) => {
                writeContract(data).then(() => {
                    alert('Minted');
                });
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });

        // variable float priceEth


    }



    return (
        <div className={styles.container}>
            <Head>
                <title>Wrap & Mint in gm Fam!</title>
                <meta
                    content="gm Fam! -- mint your own NFTs"
                    name="gm Fam! --mint your own NFTs"
                />
                <link href="/favicon.png" rel="icon" />
            </Head>
            {!closeTopContainer && (
                <div className={styles.topContainer}>
                    <div className={styles.topContainer__xContainer}>
                        <Button
                            className={styles.topContainer__xContainer__xButton}
                            colorScheme='null'
                            onClick={() => setCloseTopContainer(true)}
                        >x</Button>
                    </div>
                    <div className={styles.topContainer__textContainer}>
                        <h1>
                            This is an alpha version of the gm Fam! dApp.
                        </h1>
                        <p>
                            If you want to use the last and up-to-date stable version please go to:
                        </p>
                        <p>
                            <a href="https://gm-fam.vercel.app/">gm-fam.vercel.app</a>
                        </p>
                        <br />
                        <p>
                            Made with ❤️ by <a href="https://twitter.com/andrealbiac" target="_blank">@andrealbiac</a>, <a href="https://twitter.com/jistro" target="_blank">@jistro</a> and <a href="https://twitter.com/ariutokintumi" target="_blank">@ariutokintumi</a>
                        </p>
                    </div>
                </div>
            )}
            <header>
                <img src="/pink-logo.png" alt="RainbowKit Logo" height={100} width={100} />

                <ConnectButton />
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label='Options'
                        icon={<FaBars />}
                        colorScheme='green'
                    />

                    <MenuList >
                        <MenuItem onClick={() => window.location.href = '/'}>
                            Create gm Fam!
                        </MenuItem>
                        <MenuItem
                            backgroundColor={'gray.600'}
                            color={'white'}
                        >
                            Wrap & Mint NFT
                        </MenuItem>
                        <MenuItem onClick={() => window.location.href = '/goBack'}>
                            Go back to the Original Collection
                        </MenuItem>

                    </MenuList>
                </Menu>
            </header>
            <main className={styles.main}>
                {isClient && (
                    <div
                        style={{
                            padding: '20px',
                        }}
                    >

                        <div className={styles.container__form}>
                            <div className={styles.container__form__header}>
                                <img
                                    src="/uvas-mint.svg"
                                    alt="gmFam Logo"

                                />
                                <h1
                                    style={{
                                        color: '#083f99',
                                        fontSize: '40px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Wrap &amp; Mint
                                </h1>
                            </div>
                            <div>
                                gm Fam! Deployed Smart Contract address (New one)
                                <Input size='sm' type="text" backgroundColor='gray.100' placeholder="0x..." id="gmFam_new_addresss" />
                            </div>
                            <div>
                                Token ID (NFT)
                                <Input size='sm' type="number" placeholder="0" backgroundColor='gray.100' id="mint_id" />
                            </div>
                            <div>
                                <p>Original Smart Contract address (Old one)</p>
                                <Input size='sm' type="text" placeholder="0x..." backgroundColor='gray.100' id="original_addresss" />
                            </div>
                            <div className={styles.container__twoSideByside}>
                                <div>
                                    <Button colorScheme='blue'
                                        onClick={givePermission}
                                    >
                                        Give me your permission fren
                                    </Button>
                                </div>
                                <div>
                                    <Button colorScheme='pink'
                                        onClick={safeMint}
                                    >
                                        Mint
                                    </Button>
                                </div>
                            </div>

                        </div>


                    </div>
                )}
            </main>
        </div >
    );
};

export default Home;
