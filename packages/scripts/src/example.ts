import { Resource } from "sst";
import { Example } from "@sst-dev/core/example";

console.log(`${Example.hello()} Linked to ${Resource.MyBucket.name}.`);
