import { useState } from "react"
import { View, Text, ScrollView, Alert, Linking } from "react-native"
import { useNavigation } from "expo-router"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

import { ProductCartProps, useCartStore } from "@/stores/cart-store"

import { Product } from "@/components/product"

import { Header } from "@/components/header"
import { formatCurrency } from "@/utils/functions/format-currency"
import { Input } from "@/components/input"
import { Button } from "@/components/button"
import { Feather } from "@expo/vector-icons"
import { LinkButton } from "@/components/link-button"

const NUMBER_PHONE = "5588997746180"

export default function Cart() {
    const [address, setAddress] = useState("")
    const cartStore = useCartStore()
    const navigation = useNavigation()

    const total = formatCurrency(cartStore.products.reduce((total, product) => total + product.price * product.quantity, 0))

    function handleProductRemove(product: ProductCartProps) {
        Alert.alert("Remover", `Deseja remover ${product.title} do pedido?`, [
            {
                text: "Cancelar",
            },
            {
                text: "Remover",
                onPress: () => cartStore.remove(product.id),
            },
        ])
    }

    function handlOrder() {
        if (address.trim().length === 0) {
            return Alert.alert("Pedido", "Informe o endereço para entrega")
        }

        const products = cartStore.products.map((product) => `\n ${product.quantity} ${product.title}`).join("")
        const message = `
            NOVO PEDIDO
            \n Entragrar em: ${address}

            ${products}

            \n Valor ttal: ${total}
        `
        Linking.openURL(`http://api.whatsapp.com/send?phone=${NUMBER_PHONE}&text=${message}`)

        cartStore.clear()
        navigation.goBack()
    }

    return (
        <View className="flex-1 pt-8">
            <Header title="Seu pedido" />

            <KeyboardAwareScrollView>
                <ScrollView>
                    <View className="p-5 flex-1">
                        {cartStore.products.length > 0 ? (
                            <View className="border-b border-slate-700">
                                {cartStore.products.map((product) => (
                                    <Product key={product.id} data={product} onPress={() => handleProductRemove(product)} />
                                ))}
                            </View>
                        ) : (
                            <Text className="font-body text-slate-400 text-center">Não há pedidos selecionados</Text>
                        )}

                        <View className="flex-row gap-2 items-center mt-5 mb-4">
                            <Text className="text-white text-xl font-subtitle">Total:</Text>
                            <Text className="text-lime-400 text-2xl font-heading">{total}</Text>
                        </View>

                        <Input placeholder="Informe o endereço: bairro, rua, número..." onChangeText={setAddress} blurOnSubmit={true} onSubmitEditing={handlOrder} returnKeyType="next" />
                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>

            <View className="p-5 gap-5">
                <Button onPress={handlOrder}>
                    <Button.Text>Enviar pedido</Button.Text>
                    <Button.Icon>
                        <Feather name="arrow-right-circle" size={20} />
                    </Button.Icon>
                </Button>
                <LinkButton title="Voltar" href="/" />
            </View>
        </View>
    )
}
