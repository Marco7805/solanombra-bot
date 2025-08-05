import base58
import json

private_key_string = "5aNnAwjE566icL5PqqaZ6iWVbuESLKQDN9mqYS1JjaUrb9fSwugRt763xRXSticLqAhaSmimsJ3dzBXdGu4TGrW3"

try:
    private_key_bytes = base58.b58decode(private_key_string)
    keypair_array = list(private_key_bytes)
    print(f"Keypair array: {keypair_array}")
    
    with open('config/your_wallet.json', 'w') as f:
        json.dump(keypair_array, f)
    
    print("✅ Nuovo Wallet A salvato in config/your_wallet.json")
    
except Exception as e:
    print(f"Errore: {e}") 