import { TouchableOpacity, Text, Platform } from "react-native";
import { openBrowserAsync } from "expo-web-browser";

type Props = {
  href: string;
  children: React.ReactNode;
  style?: any;
  [key: string]: any;
};

export function ExternalLink({ href, children, ...rest }: Props) {
  const handlePress = async () => {
    if (Platform.OS !== "web") {
      await openBrowserAsync(href);
    } else {
      window.open(href, "_blank");
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} {...rest}>
      {children}
    </TouchableOpacity>
  );
}
